#include "VariablePrimitiveDouble.h"
#include "../Binary/extract.h"

namespace Storage {
VariablePrimitiveDouble::VariablePrimitiveDouble(double value)
{
  this->value = value;
}

VariablePrimitiveDouble::VariablePrimitiveDouble(val value)
{
  this->value = value.as<double>();
}

const val VariablePrimitiveDouble::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

double VariablePrimitiveDouble::get_value() const
{
  return this->value;
}

char VariablePrimitiveDouble::get_char() const
{
  return this->value;
}

int VariablePrimitiveDouble::get_int() const
{
  return this->value;
}

long VariablePrimitiveDouble::get_long() const
{
  return this->value;
}

float VariablePrimitiveDouble::get_float() const
{
  return this->value;
}

double VariablePrimitiveDouble::get_double() const
{
  return this->value;
}
}
