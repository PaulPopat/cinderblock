#include "VariableTuple.h"

namespace Storage
{
  VariableTuple::VariableTuple(std::vector<VariableTuplePart> value)
  {
    this->value = value;
  }

  VariableTuple::VariableTuple(val value)
  {
    this->value = std::vector<VariableTuplePart>();
    for (const auto &pair : vecFromJSArray<val>(value))
    {
      this->value.push_back({pair["name"].as<std::string>(), Variable::Parse(pair["value"])});
    }
  }

  VariableTuple::~VariableTuple()
  {
    for (const auto &part : this->value)
    {
      delete part.value;
    }
  }

  const val VariableTuple::raw() const
  {
    auto result = val::object();

    for (const auto &part : this->value)
    {
      result.set(part.name, part.value->raw());
    }

    return result;
  }
}