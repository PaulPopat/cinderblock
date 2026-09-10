#pragma once

#include "Variable.h"

namespace Storage {
class VariablePrimitiveNull : public Variable {
  public:
  static const VariablePrimitiveNull* FromVariable(const Variable* var)
  {
    if (var->IsType != VariablePrimitiveNull::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveNull*)var;
  }

  const static char TypeName = 5;
  const char IsType = 5;
  VariablePrimitiveNull();
  VariablePrimitiveNull(val value);

  const val raw() const;
};
}
