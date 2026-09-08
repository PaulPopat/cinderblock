#include "./Instruction.h"

namespace Binary
{
  class LiteralLong : Instruction
  {
  public:
    LiteralLong(char *binary, int offset);

    const int get_end() const;

  private:
    long* value;
    int end;
  };
}