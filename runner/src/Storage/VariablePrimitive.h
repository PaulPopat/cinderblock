#pragma once

#include "Variable.h"

namespace Storage
{
  template <typename T,
            typename = typename std::enable_if<std::is_arithmetic<T>::value, T>::type>
  class VariablePrimitive : public Variable
  {
  public:
    static const VariablePrimitive *FromVariable(const Variable *var)
    {
      return (VariablePrimitive *)var;
    }

    static T GetValue(const Variable *var)
    {
      auto casted = (VariablePrimitive *)var;
      return (T)casted->get_value();
    }

    virtual T get_value() const = 0;
  };
}