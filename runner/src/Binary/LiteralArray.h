#pragma once

#include "Instruction.h"
#include <vector>

namespace Binary {
class LiteralArray : public Instruction {
  public:
  const static char TypeName = 4;
  LiteralArray(const char*binary, int offset);
  ~LiteralArray();

  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  std::vector<Instruction*> values;
  int end;
};
}
