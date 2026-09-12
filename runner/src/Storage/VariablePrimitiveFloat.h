#pragma once

#include "VariablePrimitive.h"

namespace Storage {
class VariablePrimitiveFloat : public VariablePrimitive<float> {
  public:
  static const VariablePrimitiveFloat* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveFloat::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveFloat*)var;
  }

  const static char TypeName = 3;
  const char IsType = 3;
  VariablePrimitiveFloat(float value);
  VariablePrimitiveFloat(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveFloat::TypeName;
  }

  const val raw() const;
  float get_value() const;

  private:
  float value;
};
}
