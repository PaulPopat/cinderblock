#include "VariableTuple.h"
#include "../CinderblockException.h"
#include "VariablePipeable.h"
#include "VariablePrimitiveNull.h"
#include <string>

namespace Storage {
VariableTuple::VariableTuple()
{
  this->value = std::vector<VariableTuplePart>();
}

VariableTuple::VariableTuple(const std::vector<VariableTuplePart>& value)
{
  this->value = std::vector<VariableTuplePart>();
  for (const auto& part : value) {
    this->value.push_back(part);
  }
}

VariableTuple::VariableTuple(val value)
{
  this->value = std::vector<VariableTuplePart>();
  for (const auto& pair : vecFromJSArray<val>(value)) {
    this->value.push_back({ pair["name"].as<std::string>(), Variable::Parse(pair["value"]) });
  }
}

VariableTuple::~VariableTuple()
{
}

const VariableTuple* VariableTuple::merge(const VariableTuple* input) const
{
  auto result = std::vector<VariableTuplePart>();
  for (const auto& part : this->value) {
    result.push_back(part);
  }

  for (const auto& part : input->value) {
    result.push_back(part);
  }

  return new VariableTuple(result);
}

const Variable* VariableTuple::get(std::string name) const
{

  for (const auto& part : this->value) {
    if (part.name.compare(name) == 0) {
      return part.value;
    }
  }

  return (Variable*)new VariablePrimitiveNull();
}

const val VariableTuple::raw() const
{
  auto vec = std::vector<val>();

  for (const auto& part : this->value) {
    auto input = val::object();
    input.set("name", part.name);
    input.set("value", part.value->raw());
    vec.push_back(input);
  }

  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val::array(vec));

  return result;
}

const std::vector<VariableTuplePart> VariableTuple::get_parts() const
{
  return this->value;
}

const Variable* VariableTuple::operate_pipe(const Variable* right) const
{
  auto pipeable = VariablePipeable::FromVariable(right);
  if (pipeable != nullptr) {
    return pipeable->invoke(this);
  }

  auto tuple = VariableTuple::FromVariable(right);
  if (tuple != nullptr) {
    return this->merge(tuple);
  }

  throw CinderblockException("Invalid pipe");
}

const Variable* VariableTuple::operate_partial_pipe(const Variable* right) const
{
  return new VariablePipeable(
    [this, right](const VariableTuple* args) {
      return VariablePipeable::FromVariable(right)->invoke(this->merge(args));
    },
    false
  );
}
}
