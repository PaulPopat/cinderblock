#include "Variable.h"
#include "VariableArray.h"

namespace Storage
{
  VariableArray::VariableArray(std::vector<const Variable *> values)
  {
    this->values = values;
  }

  VariableArray::~VariableArray()
  {
    for (const auto &value : this->values)
    {
      delete value;
    }
  }

  VariableArray::VariableArray(val value)
  {
    if (!value.isArray())
    {
      throw "Value not array";
    }

    auto values = std::vector<const Variable *>();
    for (const auto &v : convertJSArrayToNumberVector<val>(value))
    {
      values.push_back(Variable::Parse(v));
    }

    this->values = values;
  }

  const val VariableArray::raw() const
  {
    auto result = std::vector<val>();
    for (const auto &value : this->values)
    {
      result.push_back(value->raw());
    }

    return val::array();
  }

  const std::vector<const Variable *> VariableArray::get_values() const
  {
    auto result = std::vector<const Variable *>();
    for (const auto &var : this->values)
    {
      result.push_back(var);
    }

    return result;
  }
}