#pragma once

#include "Instruction.h"

namespace Binary
{
  class LiteralChar : public Instruction
  {
  public:
    const static char TypeName = 6;
    LiteralChar(char *binary, int offset);

    const int get_end() const;
    const Variable *resolve(Closure *closure) const;

  private:
    char value;
    int end;
  };
}