#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class Reference : Instruction
  {
  public:
    const static char TypeName = 15;
    Reference(char *binary, int offset);
    ~Reference();
    const int get_end() const;

  private:
    LiteralString *name;
    int end;
  };
}