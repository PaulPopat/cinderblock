#pragma once

#include "Instruction.h"
#include "LiteralString.h"

namespace Binary {
class Index : public Instruction {
  public:
  const static char TypeName = 19;
  Index(const char*binary, int offset);
  ~Index();
  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  Instruction* subject;
  Instruction* index;
  int end;
};
}
