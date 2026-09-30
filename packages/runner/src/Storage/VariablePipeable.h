#pragma once

#include "Variable.h"
#include "VariableTuple.h"
#include <functional>

namespace Storage {
class VariablePipeable : public Variable {
  public:
  static const VariablePipeable* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePipeable::TypeName) {
      return nullptr;
    }

    return (VariablePipeable*)var;
  }

  const static char TypeName = 1;
  VariablePipeable(std::function<const Variable*(const VariableTuple*)> implementation, bool no_args);
  VariablePipeable(val value);

  const char get_type_name() const
  {
    return VariablePipeable::TypeName;
  }

  const bool get_no_args() const;
  const val raw() const;
  const Variable* invoke(const VariableTuple* args) const;

  private:
  std::function<const Variable*(const VariableTuple*)> implementation;
  bool no_args;
};
}
