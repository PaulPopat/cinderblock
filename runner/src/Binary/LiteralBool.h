#include "./Instruction.h"

namespace Binary
{
  class LiteralBool : Instruction
  {
  public:
    LiteralBool(char *binary, int offset);

    const int get_end() const;

  private:
    bool value;
    int end;
  };
}