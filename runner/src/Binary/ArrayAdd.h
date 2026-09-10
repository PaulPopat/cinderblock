#pragma once

#include "Instruction.h"
#include "LiteralString.h"

namespace Binary {
class ArrayAdd : public Instruction {
  public:
  const static char TypeName = 2;
  ArrayAdd(char* binary, int offset);
  ~ArrayAdd();
  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  Instruction* left;
  Instruction* right;
  int end;
};
}
