#include "VariableArray.h"

namespace Storage
{
  VariableArray::VariableArray(std::vector<Variable *> values)
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

    auto values = std::vector<Variable *>();
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
}