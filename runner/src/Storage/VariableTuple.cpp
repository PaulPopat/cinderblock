#include "VariableTuple.h"
#include "VariablePrimitiveNull.h"

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

  const VariableTuple *VariableTuple::merge(const VariableTuple *input) const
  {
    auto result = std::vector<VariableTuplePart>();
    for (const auto &part : this->value)
    {
      result.push_back(part);
    }

    for (const auto &part : input->value)
    {
      result.push_back(part);
    }

    return new VariableTuple(result);
  }

  const Variable *VariableTuple::get(std::string name) const
  {

    for (const auto &part : this->value)
    {
      if (part.name.compare(name))
      {
        return part.value;
      }
    }

    return (Variable *)new VariablePrimitiveNull();
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