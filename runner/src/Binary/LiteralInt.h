#pragma once

#include "Instruction.h"

namespace Binary
{
  class LiteralInt : public Instruction
  {
  public:
    const static char TypeName = 9;
    LiteralInt(char *binary, int offset);
    ~LiteralInt();

    const int get_end() const;
    const Variable *resolve(Closure *closure) const;

  private:
    int *value;
    int end;
  };
}