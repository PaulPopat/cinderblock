#pragma once

#include "VariablePrimitive.h"

namespace Storage {
class VariablePrimitiveChar : public VariablePrimitive<char> {
  public:
  static const VariablePrimitiveChar* FromVariable(const Variable* var)
  {
    if (var->IsType != VariablePrimitiveChar::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveChar*)var;
  }

  const static char TypeName = 7;
  const char IsType = 7;
  VariablePrimitiveChar(char value);
  VariablePrimitiveChar(val value);

  const val raw() const;
  char get_value() const;

  private:
  char value;
};
}
