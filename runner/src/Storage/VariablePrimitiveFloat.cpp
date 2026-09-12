#include "VariablePrimitiveFloat.h"
#include "../Binary/extract.h"

namespace Storage {
VariablePrimitiveFloat::VariablePrimitiveFloat(float value)
{
  this->value = value;
}

VariablePrimitiveFloat::VariablePrimitiveFloat(val value)
{
  this->value = value.as<float>();
}

const val VariablePrimitiveFloat::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

float VariablePrimitiveFloat::get_value() const
{
  return this->value;
}
}
