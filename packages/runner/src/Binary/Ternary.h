#pragma once

#include "Instruction.h"

namespace Binary {
class Ternary : public Instruction {
  public:
  const static char TypeName = 16;
  Ternary(const char*binary, int offset);
  ~Ternary();
  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  Instruction* predicate;
  Instruction* positive;
  Instruction* negative;
  int end;
};
}
