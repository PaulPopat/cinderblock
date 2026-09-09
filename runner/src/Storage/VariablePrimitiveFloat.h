#pragma once

#include "VariablePrimitive.h"

namespace Storage
{
  class VariablePrimitiveFloat : public VariablePrimitive<float>
  {
  public:
    static const VariablePrimitiveFloat *FromVariable(const Variable *var)
    {
      if (var->TypeName != VariablePrimitiveFloat::TypeName)
      {
        return nullptr;
      }

      return (VariablePrimitiveFloat *)var;
    }

    const static char TypeName = 3;
    const char TypeName = 3;
    VariablePrimitiveFloat(float value);
    VariablePrimitiveFloat(val value);

    const val raw() const;
    float get_value() const;

  private:
    float value;
  };
}