#pragma once

#include "Instruction.h"

namespace Binary {
class LiteralLong : public Instruction {
  public:
  const static char TypeName = 10;
  LiteralLong(const char*binary, int offset);
  ~LiteralLong();

  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  long value;
  int end;
};
}
