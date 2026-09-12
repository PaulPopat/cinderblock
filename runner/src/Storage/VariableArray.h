#pragma once

#include "Variable.h"
#include <vector>

namespace Storage {
class VariableArray : public Variable {
  public:
  static const VariableArray* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariableArray::TypeName) {
      return nullptr;
    }

    return (VariableArray*)var;
  }

  const static char TypeName = 0;
  VariableArray(std::vector<const Variable*> values);
  VariableArray(val value);
  ~VariableArray();

  const char get_type_name() const
  {
    return VariableArray::TypeName;
  }

  const val raw() const;
  const std::vector<const Variable*> get_values() const;

  private:
  std::vector<const Variable*> values;
};
}
