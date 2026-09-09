#pragma once

#include "VariablePrimitive.h"

namespace Storage
{
  class VariablePrimitiveBool : public VariablePrimitive<bool>
  {
  public:
    static const VariablePrimitiveBool *FromVariable(const Variable *var)
    {
      if (var->TypeName != VariablePrimitiveBool::TypeName)
      {
        return nullptr;
      }

      return (VariablePrimitiveBool *)var;
    }

    const static char TypeName = 2;
    const char TypeName = 2;
    VariablePrimitiveBool(bool value);
    VariablePrimitiveBool(val value);

    const val raw() const;
    bool get_value() const;

  private:
    bool value;
  };
}