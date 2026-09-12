#include "VariableTuple.h"
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
}
