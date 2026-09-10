#pragma once

#include "Instruction.h"

namespace Binary {
enum OperatorType {
  Add = 0,
  And = 1,
  Divide = 2,
  Equals = 3,
  GreaterThan = 4,
  GreaterThanOrEqualTo = 5,
  In = 6,
  LessThan = 7,
  LessThanOrEqualTo = 8,
  Multiply = 9,
  NotEquals = 10,
  Or = 11,
  PartialPipe = 12,
  Pipe = 13,
  Subtract = 14,
  Modulo = 15
};

class Operator : public Instruction {
  public:
  const static char TypeName = 14;
  Operator(char* binary, int offset);
  ~Operator();
  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  OperatorType type;
  Instruction* left;
  Instruction* right;
  int end;
};
}
