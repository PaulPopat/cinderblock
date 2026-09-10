#pragma once

#include "Variable.h"
#include "VariableTuple.h"
#include <functional>

namespace Storage {
class VariablePipeable : public Variable {
  public:
  static const VariablePipeable* FromVariable(const Variable* var)
  {
    if (var->IsType != VariablePipeable::TypeName) {
      return nullptr;
    }

    return (VariablePipeable*)var;
  }

  const static char TypeName = 1;
  const char IsType = 1;
  VariablePipeable(std::function<const Variable*(const VariableTuple*)> implementation, bool no_args);
  VariablePipeable(val value);

  const val raw() const;
  const Variable* invoke(const VariableTuple* args) const;

  private:
  std::function<const Variable*(const VariableTuple*)> implementation;
  bool no_args;
};
}
