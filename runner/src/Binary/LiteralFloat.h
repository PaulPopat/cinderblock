#pragma once

#include "Instruction.h"

namespace Binary {
class LiteralFloat : public Instruction {
  public:
  const static char TypeName = 8;
  LiteralFloat(char* binary, int offset);
  ~LiteralFloat();

  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  float* value;
  int end;
};
}
