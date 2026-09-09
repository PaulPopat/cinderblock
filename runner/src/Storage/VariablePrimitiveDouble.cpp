#include "VariablePrimitiveDouble.h"
#include "../Binary/extract.h"

namespace Storage
{
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
    return val(this->value);
  }
}