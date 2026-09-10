#pragma once

#include "../Storage/Closure.h"
#include "../Storage/Variable.h"
#include <functional>

using namespace Storage;

namespace Binary {
class Instruction {
  public:
  static Instruction* Parse(char* binary, int offset);
  static void Register(char identifier, std::function<Instruction*(char* binary, int offset)> init);
  virtual ~Instruction() { }

  virtual const int get_end() const = 0;

  virtual const Variable* resolve(Closure* closure) const = 0;
};
}
