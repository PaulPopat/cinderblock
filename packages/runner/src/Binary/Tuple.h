#pragma once

#include "Instruction.h"
#include "LiteralString.h"
#include <vector>

namespace Binary {
struct TuplePart {
  LiteralString* name;
  Instruction* value;
};

class Tuple : public Instruction {
  public:
  const static char TypeName = 17;
  Tuple(const char*binary, int offset);
  ~Tuple();

  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  std::vector<TuplePart> values;
  int end;
};
}
