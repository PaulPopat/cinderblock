#pragma once

#include "VariablePrimitive.h"

namespace Storage {
class VariablePrimitiveDouble : public VariablePrimitive<double> {
  public:
  static const VariablePrimitiveDouble* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveDouble::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveDouble*)var;
  }

  const static char TypeName = 9;
  const char IsType = 9;
  VariablePrimitiveDouble(double value);
  VariablePrimitiveDouble(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveDouble::TypeName;
  }

  const val raw() const;
  double get_value() const;

  private:
  double value;
};
}
