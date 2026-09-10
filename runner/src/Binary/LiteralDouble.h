#pragma once

#include "Instruction.h"

namespace Binary {
class LiteralDouble : public Instruction {
  public:
  const static char TypeName = 7;
  LiteralDouble(const char*binary, int offset);
  ~LiteralDouble();

  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  double* value;
  int end;
};
}
