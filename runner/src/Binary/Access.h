#pragma once

#include "Instruction.h"
#include "LiteralString.h"

namespace Binary {
class Access : public Instruction {
  public:
  const static char TypeName = 0;
  Access(const char*binary, int offset);
  ~Access();
  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  Instruction* subject;
  LiteralString* key;
  int end;
};
}
