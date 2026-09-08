#include "./Instruction.h"

namespace Binary
{
  class LiteralFloat : Instruction
  {
  public:
    LiteralFloat(char *binary, int offset);

    const int get_end() const;

  private:
    float* value;
    int end;
  };
}