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
  auto str = std::string(this->value);
  str.pop_back();
  auto result = val::object();
  result.set("type", this->IsType);
  result.set("data", val(str));

  return result;
}

std::string VariablePrimitiveString::get_value() const
{
  return this->value;
}
}
