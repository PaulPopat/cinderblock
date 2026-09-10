#pragma once

#include "VariablePrimitive.h"

namespace Storage {
class VariablePrimitiveLong : public VariablePrimitive<long> {
  public:
  static const VariablePrimitiveLong* FromVariable(const Variable* var)
  {
    if (var->IsType != VariablePrimitiveLong::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveLong*)var;
  }

  const static char TypeName = 8;
  const char IsType = 8;
  VariablePrimitiveLong(long value);
  VariablePrimitiveLong(val value);

  const val raw() const;
  long get_value() const;

  private:
  long value;
};
}
