#pragma once

#include "VariablePrimitive.h"

namespace Storage {
class VariablePrimitiveLong : public VariablePrimitive<long> {
  public:
  static const VariablePrimitiveLong* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveLong::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveLong*)var;
  }

  const static char TypeName = 8;
  const char IsType = 8;
  VariablePrimitiveLong(long value);
  VariablePrimitiveLong(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveLong::TypeName;
  }

  const val raw() const;
  long get_value() const;

  private:
  long value;
};
}
