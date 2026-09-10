#pragma once

#include "Instruction.h"
#include "LiteralString.h"

namespace Binary {
class External : public Instruction {
  public:
  const static char TypeName = 3;
  External(char* binary, int offset);
  ~External();
  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  LiteralString* name;
  int end;
};
}
