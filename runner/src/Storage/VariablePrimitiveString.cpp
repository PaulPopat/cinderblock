#include "VariablePrimitiveString.h"

namespace Storage
{
  VariablePrimitiveString::VariablePrimitiveString(std::string value)
  {
    this->value = value;
  }

  VariablePrimitiveString::VariablePrimitiveString(val value)
  {
    this->value = value.as<std::string>();
  }

  const val VariablePrimitiveString::raw() const
  {
    return val(this->value);
  }
}