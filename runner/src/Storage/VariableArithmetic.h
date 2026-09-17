#pragma once

#include "Variable.h"

namespace Storage {
class VariableArithmetic : public Variable {
  public:
  static const VariableArithmetic* FromVariable(const Variable* var)
  {
    return (VariableArithmetic*)var;
  }

  virtual char get_char() const = 0;
  virtual int get_int() const = 0;
  virtual long long get_long() const = 0;
  virtual float get_float() const = 0;
  virtual double get_double() const = 0;
};
}
