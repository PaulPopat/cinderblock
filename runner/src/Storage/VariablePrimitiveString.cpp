#include "VariablePrimitiveString.h"

namespace Storage {
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
  auto result = val::object();
  result.set("type", this->IsType);
  auto c_str = this->value.c_str();
  result.set("data", val(this->value));

  return result;
}

std::string VariablePrimitiveString::get_value() const
{
  return this->value;
}
}
