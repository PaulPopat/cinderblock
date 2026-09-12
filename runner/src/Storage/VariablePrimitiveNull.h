#pragma once

#include "Variable.h"

namespace Storage {
class VariablePrimitiveNull : public Variable {
  public:
  static const VariablePrimitiveNull* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveNull::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveNull*)var;
  }

  const static char TypeName = 5;
  const char IsType = 5;
  VariablePrimitiveNull();
  VariablePrimitiveNull(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveNull::TypeName;
  }

  const val raw() const;
};
}
