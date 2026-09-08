#include "./Instruction.h"

namespace Binary
{
  class LiteralNull : Instruction
  {
  public:
    LiteralNull(char *binary, int offset);

    const int get_end() const;

  private:
    int end;
  };
}