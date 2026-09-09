#pragma once

#include "Instruction.h"

namespace Binary
{
  class LiteralBool : public Instruction
  {
  public:
    const static char TypeName = 5;
    LiteralBool(char *binary, int offset);

    const int get_end() const;
    const Variable *resolve(Closure *closure) const;

  private:
    bool value;
    int end;
  };
}