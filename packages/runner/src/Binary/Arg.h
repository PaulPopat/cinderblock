#pragma once

#include "Instruction.h"
#include "LiteralString.h"

namespace Binary {
class Arg : public Instruction {
  public:
  const static char TypeName = 1;
  Arg(const char*binary, int offset);
  ~Arg();
  const int get_end() const;
  const Storage::Variable* resolve(Storage::Closure* closure) const;

  private:
  LiteralString* name;
  int end;
};
}
