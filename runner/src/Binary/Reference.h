#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class Reference : Instruction
  {
  public:
    Reference(char *binary, int offset);
    const int get_end() const;

  private:
    LiteralString *name;
    int end;
  };
}