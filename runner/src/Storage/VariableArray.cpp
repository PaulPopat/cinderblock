#include "VariableArray.h"
#include "Variable.h"

namespace Storage {
VariableArray::VariableArray(std::vector<const Variable*> values)
{
  this->values = values;
}

VariableArray::~VariableArray()
{
}

VariableArray::VariableArray(val value)
{
  if (!value.isArray()) {
    throw "Value not array";
  }

  auto values = std::vector<const Variable*>();
  for (const auto& v : vecFromJSArray<val>(value)) {
    values.push_back(Variable::Parse(v));
  }

  this->values = values;
}

const val VariableArray::raw() const
{
  auto vec = std::vector<val>();
  for (const auto& value : this->values) {
    vec.push_back(value->raw());
  }

  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val::array(vec));

  return result;
}

const std::vector<const Variable*> VariableArray::get_values() const
{
  auto result = std::vector<const Variable*>();
  for (const auto& var : this->values) {
    result.push_back(var);
  }

  return result;
}
}
