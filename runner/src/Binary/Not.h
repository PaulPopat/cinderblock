#pragma once

#include "Instruction.h"

namespace Binary
{
  class Not : public Instruction
  {
  public:
    const static char TypeName = 13;
    Not(char *binary, int offset);
    ~Not();
    const int get_end() const;
    const Variable *resolve(Closure *closure) const;

  private:
    Instruction *subject;
    int end;
  };
}