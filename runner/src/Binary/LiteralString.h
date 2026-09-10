#pragma once

#include "Instruction.h"

namespace Binary {
class LiteralString : public Instruction {
  public:
  const static char TypeName = 12;
  LiteralString(char* binary, int offset);

  std::string get_value() const;
  const Variable* resolve(Closure* closure) const;
  const int get_end() const;

  private:
  const char* binary;
  const int offset;
  int end;
};
}
