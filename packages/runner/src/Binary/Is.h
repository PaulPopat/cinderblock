#pragma once

#include "Instruction.h"
#include "Shape.h"

namespace Binary {
class Is : public Instruction {
  public:
  const static char TypeName = 18;
  Is(const char*binary, int offset);
  ~Is();
  const int get_end() const;
  const Variable* resolve(Closure* closure) const;

  private:
  const Instruction* left;
  const Shape* right;
  int end;
};
}
