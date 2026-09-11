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
  result.set("type", this->IsType);
  result.set("data", val(this->value));

  return result;
}

double VariablePrimitiveDouble::get_value() const
{
  return this->value;
}
}
