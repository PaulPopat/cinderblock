#include "VariablePrimitiveFloat.h"
#include "../Binary/extract.h"

namespace Storage
{
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
    return val(this->value);
  }
}