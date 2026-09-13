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

char VariablePrimitiveFloat::get_char() const
{
  return this->value;
}

int VariablePrimitiveFloat::get_int() const
{
  return this->value;
}

long VariablePrimitiveFloat::get_long() const
{
  return this->value;
}

float VariablePrimitiveFloat::get_float() const
{
  return this->value;
}

double VariablePrimitiveFloat::get_double() const
{
  return this->value;
}
}
